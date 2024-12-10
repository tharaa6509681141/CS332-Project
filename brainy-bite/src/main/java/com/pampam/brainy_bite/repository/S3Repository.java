package com.pampam.brainy_bite.repository;

import com.pampam.brainy_bite.models.pending_articles;
import com.pampam.brainy_bite.payload.request.PendingRequest;

public interface S3Repository {
    int insertPendingArticle(PendingRequest pendingRequest, String pdfUrl, String imageUrl);
}
