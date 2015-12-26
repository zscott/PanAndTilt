FROM node:5-wheezy
MAINTAINER Zach Scott <zach.mobile@gmail.com>

RUN echo 'will expose port 8888'
EXPOSE 8888

RUN echo 'copying files'
COPY app app/

RUN cd app && npm install

CMD cd app && ./start.sh
