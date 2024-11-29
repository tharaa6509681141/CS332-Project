package com.pampam.brainy_bite.repository;

import java.util.List;
import com.pampam.brainy_bite.models.articles;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticlesRepository {

    List<articles> allArticles();
}
