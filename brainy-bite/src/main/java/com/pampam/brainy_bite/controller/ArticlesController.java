package com.pampam.brainy_bite.controller;

import com.pampam.brainy_bite.models.articles;
import com.pampam.brainy_bite.repository.ArticlesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ArticlesController {

    @Autowired
    ArticlesRepository articlesRepository;

    @GetMapping("/allArticles")
    public ResponseEntity<List<articles>> getAllArticles() {
        try {
            // Fetch all articles using JPA's findAll or a custom method
            List<articles> articles = articlesRepository.allArticles(); // Ensure this method exists

            // Check if the result is empty instead of null
            if (articles.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(articles, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

