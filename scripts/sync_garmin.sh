#/bin/bash
# move this to be a cron job running monthly.
garmindb_cli.py --all --download --import --analyze --latest
