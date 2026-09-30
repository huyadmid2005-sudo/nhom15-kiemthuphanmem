## Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# cache dependency layer
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests dependency:go-offline

# copy source
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package

## Run
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV TZ=UTC LANG=C.UTF-8
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]