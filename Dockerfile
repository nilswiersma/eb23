FROM python:3.8-alpine

# build tools
RUN apk update && apk add python3-dev gcc libc-dev git tree

ARG force_rebuild_from_here=1
RUN git clone https://github.com/nilswiersma/eb23.git

WORKDIR /eb23

RUN echo `ls -a /eb23`
RUN echo `ls -a .`

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

EXPOSE 8080

ENTRYPOINT [ "python", "waitress_server.py" ]
