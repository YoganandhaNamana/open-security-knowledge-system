"""
OSKS Core Engine: Logging Configuration
File: engines/logging_config.py
"""

import logging
from pathlib import Path


def get_logger(name: str, root_dir: str = ".") -> logging.Logger:
    """Returns a configured logger that writes to console and logs/build.log."""
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger  # already configured, avoid duplicate handlers

    logger.setLevel(logging.INFO)

    log_dir = Path(root_dir) / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / "build.log"

    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
