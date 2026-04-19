# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper scripts and dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Make sure the wrapper is executable
RUN chmod +x mvnw
# Download dependencies for offline builds
RUN ./mvnw dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render supplies the PORT environment variable natively
EXPOSE 3000

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
