package com.pampam.brainy_bite;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.pampam.brainy_bite.service.S3Service;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@Log4j2
public class BrainyBiteWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrainyBiteWebApplication.class, args);
	}

	@Bean
	public ApplicationRunner applicationRunner(S3Service s3Service) {
		return args -> {
			//log.info("Brainy Bite Web Application Start...");
		};
	}

}
