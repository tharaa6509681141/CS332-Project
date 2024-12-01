package com.pampam.brainy_bite.models;

public class bookmarks {
    private String bookmark_id;
    private String user_id;
    private String article_id;
    private String created_at;

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

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getBookmark_id() {
        return bookmark_id;
    }

    public void setBookmark_id(String bookmark_id) {
        this.bookmark_id = bookmark_id;
    }

    public bookmarks(String bookmark_id, String user_id, String article_id, String created_at) {
        this.bookmark_id = bookmark_id;
        this.user_id = user_id;
        this.article_id = article_id;
        this.created_at = created_at;
    }

    public bookmarks(String user_id, String article_id, String created_at) {
        this.user_id = user_id;
        this.article_id = article_id;
        this.created_at = created_at;
    }

    public bookmarks(){};
}
