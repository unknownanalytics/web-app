#!/bin/sh
DIRNAME=<your_backup_folder_location>
# create folder if doesn't exist yet
if [ ! -d $DIRNAME ]
then
        echo "backup folder does not exists yet. Creating backup folder"
        mkdir $DIRNAME
        echo "backup folder exists"
else
        echo "backup folder already exists"
fi
BACKUP_FILE_NAME="backup-$(date +'%y-%m-%d-%HH-%MM')"
PATH_TO_FILE=$DIRNAME/$BACKUP_FILE_NAME
# backup the db to date
docker exec unk-postgres /usr/bin/pg_dump -U <your_pg_user> <your_db_name> > $PATH_TO_FILE
# gzip file
gzip -c $PATH_TO_FILE > $PATH_TO_FILE.gz
# send the file now to your remote
rsync -a $PATH_TO_FILE.gz  <your_remote_file_location>
# Delete older folder
#find $DIRNAME/* -mtime +7 -delete

