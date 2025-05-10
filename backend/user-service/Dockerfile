FROM eclipse-temurin:21-jdk
VOLUME /tmp
COPY target/user-service.jar user-service.jar
ENTRYPOINT ["java", "-jar", "/user-service.jar"]
