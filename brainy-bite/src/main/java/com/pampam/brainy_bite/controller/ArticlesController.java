package com.pampam.brainy_bite.controller;

import com.pampam.brainy_bite.models.articles;
import com.pampam.brainy_bite.models.bookmarks;
import com.pampam.brainy_bite.models.user_bookmarks;
import com.pampam.brainy_bite.models.users;
import com.pampam.brainy_bite.repository.ArticlesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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

    @GetMapping(value = "/article/{search}")
    public ResponseEntity<List<articles>> findArticle (@PathVariable("search")String search){
        try{
            List<articles> articles = articlesRepository.findArticle(search);
            if(articles != null){
                return new ResponseEntity<>(articles,HttpStatus.OK);
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

    @GetMapping(value = "/category/{category}")
    public ResponseEntity<List<articles>> findbyCategory (@PathVariable("category")String category){
        try{
            List<articles> articles = articlesRepository.findbyCategory(category);
            if(articles != null){
                return new ResponseEntity<>(articles,HttpStatus.OK);
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

    @GetMapping("/article-detail/{article_id}")
    public ResponseEntity<?> infoarticle(@PathVariable("article_id") String article_id) {
        try {
            articles articles = articlesRepository.infoarticle(article_id);
            if (articles != null) {
                return new ResponseEntity<>(articles, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Article not found", HttpStatus.NOT_FOUND);
            }
        } catch (DataAccessException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Database error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/addBookmark")
    public ResponseEntity<String> addBookmark(@RequestBody bookmarks bookmark) {
        try {
            // Call the repository to save the bookmark
            articlesRepository.addBookmark(bookmark);

            // Return success response
            return new ResponseEntity<>("Bookmark added successfully!", HttpStatus.CREATED);
        } catch (Exception e) {
            // Handle any exception and return error response
            e.printStackTrace();
            return new ResponseEntity<>("Failed to add bookmark: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bookmark/{user_id}")
    public ResponseEntity<List<user_bookmarks>> getUserBookmarks(@PathVariable("user_id") String user_id) {
        try {
            List<user_bookmarks> bookmarks = articlesRepository.showBookmarks(user_id);

            if (bookmarks.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(bookmarks, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/info/{user_id}")
    public ResponseEntity<?> showUserInfo(@PathVariable("user_id") String user_id) {
        try {
            // Call the method from the repository to fetch user details
            users userInfo = articlesRepository.userInfo(user_id);

            // Check if the user is found
            if (userInfo == null) {
                return new ResponseEntity<>("User not found with id: " + user_id, HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(userInfo, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred while fetching user info.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/delete/{bookmark}")
    public ResponseEntity<String> deleteBookmark(@PathVariable("bookmark") String bookmark) {
        try {
            // Call the repository method to delete the bookmark
            int result = articlesRepository.deleteBookmark(bookmark);

            // Check if any row was affected
            if (result == 0) {
                return new ResponseEntity<>("Cannot find Bookmark with id=" + bookmark, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>("Bookmark was deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Cannot delete Bookmark.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

