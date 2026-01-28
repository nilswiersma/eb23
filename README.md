flask --app hardcoredancing run --debug 

docker build -t hardcoredancing .

docker run \
    --rm \
    -p 8082:8080 \
    --mount type=bind,source="$(pwd)"/data,target=/eb23/data \
    --name hardcoredancing \
    hardcoredancing

