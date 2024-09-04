import os
import sys
import time
import logging
import tempfile
import fitfile.conversions as conversions
from tqdm import tqdm
from garmindb import Download

logger = logging.getLogger(__file__)
logger.addHandler(logging.StreamHandler(stream=sys.stdout))
root_logger = logging.getLogger()

class TrainmeDownload(Download):
    """Override the GarminDB Download class to download activities from Garmin Connect."""
    
    def get_activities(self, directory, count, overwite=False):
        """Download activities files from Garmin Connect and save the raw files."""
        temp_dir = tempfile.mkdtemp()
        logger.info("Getting activities: '%s' (%d) temp %s", directory, count, temp_dir)
        activities = self.__get_activity_summaries(0, count)
        for activity in tqdm(activities or [], unit='activities'):
            activity_id_str = str(activity['activityId'])
            logging.debug('Downloading activitydone on %s', activity['startTimeLocal'])
            if 'activityName' not in activity or not activity['activityName']:
                activity['activityName'] = 'Unnamed activity'
            activity_name_str = conversions.printable(activity['activityName'])
            root_logger.info("get_activities: %s (%s)", activity_name_str, activity_id_str)
            json_filename = f'{directory}/activity_{activity_id_str}'
            if not os.path.isfile(json_filename + '.json') or overwite:
                root_logger.info("get_activities: %s <- %r", json_filename, activity)
                self.__save_activity_details(directory, activity_id_str, overwite)
                self.save_json_to_file(json_filename, activity)
                if not os.path.isfile(f'{directory}/{activity_id_str}.fit') or overwite:
                    self.__save_activity_file(activity_id_str)
                # pause for a second between every page access
                time.sleep(1)
            else:
                root_logger.info("get_activities: skipping download of %s, already present", activity_id_str)
        self.__unzip_files(directory)