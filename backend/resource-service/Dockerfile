FROM eclipse-temurin:21-jdk

# Install Tesseract and English language data
RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-eng && \
    rm -rf /var/lib/apt/lists/*

# Set the TESSDATA_PREFIX environment variable for Tess4J
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/
ENV TESSERACT_DATAPATH=/usr/share/tesseract-ocr/4.00/tessdata
# Copy your Spring Boot application jar
VOLUME /tmp
COPY target/resource-service.jar resource-service.jar

# Run the application
ENTRYPOINT ["java", "-jar", "/resource-service.jar"]
