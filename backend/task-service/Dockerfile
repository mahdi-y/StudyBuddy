FROM eclipse-temurin:21-jdk
VOLUME /tmp
COPY target/task-service.jar task-service.jar
ENTRYPOINT ["java", "-jar", "/task-service.jar"]
