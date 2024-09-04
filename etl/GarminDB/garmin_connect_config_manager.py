import os
from typing import Optional
from garmindb import GarminConnectConfigManager

class TrainmeGarminConnectConfigManager(GarminConnectConfigManager):
    '''Extend GarminConnectConfigManager to provide the config file path'''
    
    @classmethod
    def get_config_dir(cls, directory: Optional[str] = None) -> str:
        if (directory is None):
            directory = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        return directory
        
    def update_config(self, updates):
        self.config.update(updates)