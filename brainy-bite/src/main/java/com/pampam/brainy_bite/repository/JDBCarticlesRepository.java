package com.pampam.brainy_bite.repository;

import com.pampam.brainy_bite.models.articles;
import com.pampam.brainy_bite.models.bookmarks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
    public void addBookmark(bookmarks bookmark) {
        String sql = "INSERT INTO bookmarks (bookmark_id, user_id, article_id, created_at) " +
                "VALUES (?, ?, ?, CURRENT_DATE())";

        try {
            jdbcTemplate.update(sql,
                    bookmark.getBookmark_id(),  // Bookmark ID
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


}
