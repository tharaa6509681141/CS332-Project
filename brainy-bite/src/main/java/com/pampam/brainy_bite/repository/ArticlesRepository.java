package com.pampam.brainy_bite.repository;

import com.pampam.brainy_bite.models.articles;
import com.pampam.brainy_bite.models.bookmarks;
import java.util.List;

public interface ArticlesRepository {

    List<articles> allArticles();

    void addBookmark(bookmarks bookmark);

    int deleteBookmark(String bookmark);

}
