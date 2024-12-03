package com.pampam.brainy_bite.repository;

import com.pampam.brainy_bite.models.articles;
import com.pampam.brainy_bite.models.bookmarks;
import com.pampam.brainy_bite.models.user_bookmarks;
import com.pampam.brainy_bite.models.users;

import java.util.List;

public interface ArticlesRepository {

    List<articles> allArticles();
    List<articles> findArticle(String search);
    List<articles> findbyCategory(String category);

    users userInfo(String user_id);
    void addBookmark(bookmarks bookmark);

    int deleteBookmark(String bookmark);

    List<user_bookmarks> showBookmarks(String user_id);

}
