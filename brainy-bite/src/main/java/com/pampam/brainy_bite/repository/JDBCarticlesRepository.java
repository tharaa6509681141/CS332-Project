package com.pampam.brainy_bite.repository;

import com.pampam.brainy_bite.models.articles;
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
}
