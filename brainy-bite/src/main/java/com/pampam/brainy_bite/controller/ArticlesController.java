package com.pampam.brainy_bite.controller;

import com.pampam.brainy_bite.models.articles;
import com.pampam.brainy_bite.repository.ArticlesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api")

public class ArticlesController {

    @Autowired
    ArticlesRepository articlesRepository;
    @GetMapping(value = "/allArticles")
    public ResponseEntity<List<articles>> getallArticles (@RequestParam(required = false)String allArticles){
        try{
            List<articles> articles = articlesRepository.allArticles();
            if(articles != null){
                return new ResponseEntity<>(articles, HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
