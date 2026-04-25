FROM python:3.8-alpine

RUN apk update && apk add --no-cache python3-dev gcc libc-dev

WORKDIR /eb23

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

ENTRYPOINT [ "python", "waitress_server.py" ]
