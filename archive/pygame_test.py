import pygame

pygame.init()

pygame.display.set_mode((100, 100))

surf = pygame.Surface((10, 10))

rect = surf.get_rect(topleft=(0, 0))

pygame.font.init()

font = pygame.Font()

font.render(text: str | None = None, antialias: bool, color: Color, bgcolor: Color, wraplength: int = 0)
