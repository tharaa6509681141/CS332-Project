package com.pampam.brainy_bite.repository;

import com.pampam.brainy_bite.models.articles;
import com.pampam.brainy_bite.models.bookmarks;
import com.pampam.brainy_bite.models.user_bookmarks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.IncorrectResultSetColumnCountException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
public class JDBCarticlesRepository implements ArticlesRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<articles> allArticles() {
        String q ="SELECT * FROM articles ";
        return jdbcTemplate.query(q, BeanPropertyRowMapper.newInstance(articles.class));
    }

    @Override
    public List<articles> findArticle(String search) {
        String q = "SELECT * from articles WHERE title LIKE '%"+ search +"%'";
        return jdbcTemplate.query(q,BeanPropertyRowMapper.newInstance(articles.class));
    }

    @Override
    public List<articles> findbyCategory(String category) {
        String q = "SELECT * FROM articles WHERE category = ?";
        return jdbcTemplate.query(q, BeanPropertyRowMapper.newInstance(articles.class), category);
    }

    @Override
    public void addBookmark(bookmarks bookmark) {
        String sql = "INSERT INTO bookmarks (user_id, article_id, created_at) " +
                "VALUES (?, ?, CURRENT_DATE())";

        try {
            jdbcTemplate.update(sql,
                    bookmark.getUser_id(),      // User ID
                    bookmark.getArticle_id()    // Article ID
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add bookmark: " + e.getMessage());
        }
    }

    @Override
    public int deleteBookmark(String bookmark) {
        String query = "DELETE FROM bookmarks WHERE bookmark_id = ?";
        return jdbcTemplate.update(query, bookmark);

    }

    @Override
    public List<user_bookmarks> showBookmarks(String user_id) {
        try{
            List<user_bookmarks> user_bookmarks = jdbcTemplate.query("SELECT bookmarks.user_id, articles.*\n" +
                    "FROM bookmarks\n" +
                    "JOIN articles ON bookmarks.article_id = articles.article_id\n" +
                    "WHERE bookmarks.user_id = ?;",
                    BeanPropertyRowMapper.newInstance(user_bookmarks.class),user_id);

            return user_bookmarks;
        }catch(IncorrectResultSetColumnCountException e){
            return null;
        }

    }


}
