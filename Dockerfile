FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# mvnw (Linux) needs execute permission
RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

# Use shell form so wildcard works
CMD java -jar target/*.jar

