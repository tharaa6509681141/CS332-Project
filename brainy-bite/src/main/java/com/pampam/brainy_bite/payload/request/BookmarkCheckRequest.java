package com.pampam.brainy_bite.payload.request;

public class BookmarkCheckRequest {
    private String user_id;
    private String article_id;

    public BookmarkCheckRequest(String user_id, String article_id) {
        this.user_id = user_id;
        this.article_id = article_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getArticle_id() {
        return article_id;
    }

    public void setArticle_id(String article_id) {
        this.article_id = article_id;
    }
}
