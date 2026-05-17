package com.gamescatalog.repository;

import com.gamescatalog.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    // Find by genre (case-insensitive)
    List<Game> findByGenreIgnoreCase(String genre);

    // Find by platform
    List<Game> findByPlatformIgnoreCase(String platform);

    // Find available games
    List<Game> findByIsAvailableTrue();

    // Search by title (contains, case-insensitive)
    List<Game> findByTitleContainingIgnoreCase(String title);

    // Find by developer
    List<Game> findByDeveloperIgnoreCase(String developer);

    // Custom query: search across multiple fields
    @Query("SELECT g FROM Game g WHERE " +
           "LOWER(g.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(g.genre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(g.developer) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(g.platform) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Game> searchGames(@Param("query") String query);

    // Stats query for Lambda /report endpoint
    @Query("SELECT COUNT(g) FROM Game g")
    Long countTotal();

    @Query("SELECT COUNT(g) FROM Game g WHERE g.isAvailable = true")
    Long countAvailable();

    @Query("SELECT AVG(g.price) FROM Game g")
    Double averagePrice();

    @Query("SELECT AVG(g.rating) FROM Game g WHERE g.rating IS NOT NULL")
    Double averageRating();

    @Query("SELECT g.genre, COUNT(g) FROM Game g GROUP BY g.genre ORDER BY COUNT(g) DESC")
    List<Object[]> countByGenre();

    @Query("SELECT g.platform, COUNT(g) FROM Game g GROUP BY g.platform ORDER BY COUNT(g) DESC")
    List<Object[]> countByPlatform();
}
