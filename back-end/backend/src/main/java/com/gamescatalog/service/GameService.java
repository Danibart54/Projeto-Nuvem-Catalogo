package com.gamescatalog.service;

import com.gamescatalog.dto.GameDTO;
import com.gamescatalog.exception.ResourceNotFoundException;
import com.gamescatalog.model.Game;
import com.gamescatalog.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GameService {

    private final GameRepository gameRepository;

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public GameDTO.Response create(GameDTO.Request request) {
        Game game = mapToEntity(request);
        Game saved = gameRepository.save(game);
        return mapToResponse(saved);
    }

    // ─── READ ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<GameDTO.Summary> findAll() {
        return gameRepository.findAll()
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GameDTO.Response findById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));
        return mapToResponse(game);
    }

    @Transactional(readOnly = true)
    public List<GameDTO.Summary> search(String query) {
        return gameRepository.searchGames(query)
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GameDTO.Summary> findByGenre(String genre) {
        return gameRepository.findByGenreIgnoreCase(genre)
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GameDTO.Summary> findByPlatform(String platform) {
        return gameRepository.findByPlatformIgnoreCase(platform)
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GameDTO.Summary> findAvailable() {
        return gameRepository.findByIsAvailableTrue()
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    public GameDTO.Response update(Long id, GameDTO.Request request) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));

        game.setTitle(request.getTitle());
        game.setGenre(request.getGenre());
        game.setDeveloper(request.getDeveloper());
        game.setPublisher(request.getPublisher());
        game.setReleaseDate(request.getReleaseDate());
        game.setPrice(request.getPrice());
        game.setDescription(request.getDescription());
        game.setCoverImageUrl(request.getCoverImageUrl());
        game.setPlatform(request.getPlatform());
        game.setRating(request.getRating());
        if (request.getIsAvailable() != null) {
            game.setIsAvailable(request.getIsAvailable());
        }

        Game updated = gameRepository.save(game);
        return mapToResponse(updated);
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public void delete(Long id) {
        if (!gameRepository.existsById(id)) {
            throw new ResourceNotFoundException("Game not found with id: " + id);
        }
        gameRepository.deleteById(id);
    }

    // ─── REPORT (for Lambda /report endpoint) ──────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getReport() {
        Map<String, Object> report = new LinkedHashMap<>();

        report.put("totalGames", gameRepository.countTotal());
        report.put("availableGames", gameRepository.countAvailable());
        report.put("averagePrice", gameRepository.averagePrice());
        report.put("averageRating", gameRepository.averageRating());

        // Count by genre
        Map<String, Long> byGenre = new LinkedHashMap<>();
        gameRepository.countByGenre()
                .forEach(row -> byGenre.put((String) row[0], (Long) row[1]));
        report.put("gamesByGenre", byGenre);

        // Count by platform
        Map<String, Long> byPlatform = new LinkedHashMap<>();
        gameRepository.countByPlatform()
                .forEach(row -> byPlatform.put((String) row[0], (Long) row[1]));
        report.put("gamesByPlatform", byPlatform);

        return report;
    }

    // ─── MAPPERS ───────────────────────────────────────────────────────────────

    private Game mapToEntity(GameDTO.Request request) {
        return Game.builder()
                .title(request.getTitle())
                .genre(request.getGenre())
                .developer(request.getDeveloper())
                .publisher(request.getPublisher())
                .releaseDate(request.getReleaseDate())
                .price(request.getPrice())
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .platform(request.getPlatform())
                .rating(request.getRating())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();
    }

    private GameDTO.Response mapToResponse(Game game) {
        return GameDTO.Response.builder()
                .id(game.getId())
                .title(game.getTitle())
                .genre(game.getGenre())
                .developer(game.getDeveloper())
                .publisher(game.getPublisher())
                .releaseDate(game.getReleaseDate())
                .price(game.getPrice())
                .description(game.getDescription())
                .coverImageUrl(game.getCoverImageUrl())
                .platform(game.getPlatform())
                .rating(game.getRating())
                .isAvailable(game.getIsAvailable())
                .createdAt(game.getCreatedAt())
                .updatedAt(game.getUpdatedAt())
                .build();
    }

    private GameDTO.Summary mapToSummary(Game game) {
        return GameDTO.Summary.builder()
                .id(game.getId())
                .title(game.getTitle())
                .genre(game.getGenre())
                .developer(game.getDeveloper())
                .platform(game.getPlatform())
                .price(game.getPrice())
                .rating(game.getRating())
                .coverImageUrl(game.getCoverImageUrl())
                .isAvailable(game.getIsAvailable())
                .build();
    }
}
