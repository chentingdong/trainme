# TrainMe

🚧 **Note: This project is currently in development and not ready for use.** 🚧

## Overview

TrainMe is a powerful web application built to help athletes effectively manage their workout schedules and track fitness progress. Designed as a self-coaching tool, TrainMe offers an intuitive interface where users can easily add, edit, and review workouts. With AI-powered features, the app can generate tailored weekly training plans based on past performance, helping athletes optimize their routines. Additionally, TrainMe seamlessly syncs with your smartwatch, providing real-time lap notifications during runs.

## Key Features
- Workout Management: Easily add, edit, and view workout sessions in an intuitive web interface.
- Workout and Strava Activity Comparison: Compare your workouts with your Strava activities side by side.
- AI-Driven Training Plans: Receive personalized weekly training plans based on your previous workout data.
- Smartwatch Sync: Sync with your smartwatch to get real-time run notifications for each lap.

## Installation

This setup is intended for developers and is not yet ready for end users.

1. Copy `example.env` to `.env` and make the necessary changes.
2. Start a PostgreSQL server:
   ```sh
   docker-compose up -d
   ```
3. Set up the databases using the provided schema.
4. Bulk download Garmin data by running `garmindb_cli.py`. Refer to: [GarminDB](https://github.com/tcgoetz/GarminDB)
5. Start the UI:
   ```sh
   pnpm dev
   ```

## Usage

Once the development server is running, you can access the application in your browser at `http://localhost:<port_in_env>`.

## Components

### WorkoutEditor

The `WorkoutEditor` component allows users to add and edit workout details. It includes a modal form with fields for workout type, distance, and duration.

### Calendar

The `Calendar` page displays the workouts in a monthly view, allowing users to easily track their fitness activities.

### Activity

The `Activity` page provides another view for the workouts, aiming to offer a better summary.

### Settings

The `Settings` page is used to connect to Strava and Garmin, and to refresh data from their databases.

## License

All Rights reserved for now.

## Contact

For any questions or suggestions, please contact [chentingdong@gmail.com](mailto:chentingdong@gmail.com).
