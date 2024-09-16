plugins {
	java
	id("org.springframework.boot") version "3.2.4"
	id("io.spring.dependency-management") version "1.1.4"
}

group = "com.soco"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.google.firebase:firebase-admin:9.2.0")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	implementation("org.mongodb:mongodb-driver-core:5.1.4")
	implementation("org.mongodb:mongodb-driver-sync:5.1.4")
	implementation("org.json:json:20090211")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
