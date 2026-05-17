package com.gamescatalog.config;

import com.gamescatalog.model.Game;
import com.gamescatalog.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    @Bean
    @Profile("!test")
    public CommandLineRunner seedData(GameRepository repo) {
        return args -> {
            if (repo.count() > 0) return; // Skip if already seeded

            List<Game> games = List.of(
                Game.builder()
                    .title("The Legend of Zelda: Tears of the Kingdom")
                    .genre("Action-Adventure")
                    .developer("Nintendo EPD")
                    .publisher("Nintendo")
                    .releaseDate(LocalDate.of(2023, 5, 12))
                    .price(299.99)
                    .description("Explore the vast lands and mysterious skies of Hyrule in this epic sequel.")
                    .platform("Nintendo Switch")
                    .rating(9.8)
                    .isAvailable(true)
                    .build(),

                Game.builder()
                    .title("Baldur's Gate 3")
                    .genre("RPG")
                    .developer("Larian Studios")
                    .publisher("Larian Studios")
                    .releaseDate(LocalDate.of(2023, 8, 3))
                    .price(199.99)
                    .description("Gather your party and return to the Forgotten Realms in this epic RPG.")
                    .platform("PC")
                    .rating(9.6)
                    .isAvailable(true)
                    .build(),

                Game.builder()
                    .title("Cyberpunk 2077: Phantom Liberty")
                    .genre("Action RPG")
                    .developer("CD Projekt Red")
                    .publisher("CD Projekt")
                    .releaseDate(LocalDate.of(2023, 9, 26))
                    .price(149.99)
                    .description("A spy-thriller expansion for Cyberpunk 2077 set in the new district of Dogtown.")
                    .platform("PC")
                    .rating(8.7)
                    .isAvailable(true)
                    .build(),

                Game.builder()
                    .title("Elden Ring")
                    .genre("Action RPG")
                    .developer("FromSoftware")
                    .publisher("Bandai Namco")
                    .releaseDate(LocalDate.of(2022, 2, 25))
                    .price(249.99)
                    .description("Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.")
                    .platform("PlayStation 5")
                    .rating(9.4)
                    .isAvailable(true)
                    .build(),

                Game.builder()
                    .title("God of War Ragnarök")
                    .genre("Action-Adventure")
                    .developer("Santa Monica Studio")
                    .publisher("Sony Interactive Entertainment")
                    .releaseDate(LocalDate.of(2022, 11, 9))
                    .price(299.99)
                    .description("Kratos and Atreus must journey to each of the Nine Realms to prevent Ragnarök.")
                    .platform("PlayStation 5")
                    .rating(9.4)
                    .isAvailable(true)
                    .build(),

                Game.builder()
                    .title("Hades II")
                    .genre("Roguelike")
                    .developer("Supergiant Games")
                    .publisher("Supergiant Games")
                    .releaseDate(LocalDate.of(2024, 5, 6))
                    .price(119.99)
                    .description("The daughter of Hades wages a personal vendetta against the Titan of Time.")
                    .platform("PC")
                    .rating(9.0)
                    .isAvailable(true)
                    .build()
            );

            repo.saveAll(games);
            System.out.println("✅ Sample games seeded successfully!");
        };
    }
}
