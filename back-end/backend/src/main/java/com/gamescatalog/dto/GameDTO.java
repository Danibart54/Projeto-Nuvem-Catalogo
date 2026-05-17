package com.gamescatalog.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class GameDTO {

    // ─── Request DTO (Create/Update) ───────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank(message = "Title is required")
        @Size(min = 1, max = 255)
        private String title;

        @NotBlank(message = "Genre is required")
        private String genre;

        @NotBlank(message = "Developer is required")
        private String developer;

        @NotBlank(message = "Publisher is required")
        private String publisher;

        @NotNull(message = "Release date is required")
        private LocalDate releaseDate;

        @NotNull(message = "Price is required")
        @DecimalMin("0.0")
        private Double price;

        private String description;
        private String coverImageUrl;

        @NotBlank(message = "Platform is required")
        private String platform;

        @Min(0) @Max(10)
        private Double rating;

        private Boolean isAvailable;
    }

    // ─── Response DTO ──────────────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String genre;
        private String developer;
        private String publisher;
        private LocalDate releaseDate;
        private Double price;
        private String description;
        private String coverImageUrl;
        private String platform;
        private Double rating;
        private Boolean isAvailable;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    // ─── Summary DTO (for lists) ────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private Long id;
        private String title;
        private String genre;
        private String developer;
        private String platform;
        private Double price;
        private Double rating;
        private String coverImageUrl;
        private Boolean isAvailable;
    }
}
