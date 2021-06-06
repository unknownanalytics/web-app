#!/bin/sh
DIRNAME=/home/work/.backups/unk
# create folder if does'nt exist yet
if [ ! -d $DIRNAME ]
then
        echo "backup folder does not exists yet. Creating backup folder"
        mkdir $DIRNAME
        echo "buckup folder exists"
else
        echo "backup folder already exists"
fi
BACK_UP_FILE_NAME="backup-$(date +'%y-%m-%d-%HH-%MM')"
PATH_TO_FILE=$DIRNAME/$BACK_UP_FILE_NAME
# backup the db to date
docker exec unk-postgres /usr/bin/pg_dump -U <your_pg_user> <your_db_name> > $PATH_TO_FILE
# gzip file
gzip -c $PATH_TO_FILE > $PATH_TO_FILE.gz
# send the file now to your remote
rsync -a $PATH_TO_FILE.gz  <your_remote_file_location>
# Delete older folder
#find $DIRNAME/* -mtime +7 -delete
