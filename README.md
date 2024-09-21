# TrainMe

🚧 **Note: This project is currently in development and not ready for use.** 🚧
  
## Overview

TrainMe is a comprehensive web application designed to help athletes manage their workout schedules and track their fitness progress. As a self-coaching app, it provides a user-friendly interface to add, edit, and view workouts in a calendar format, with support for dark mode based on system preferences.

## Features

* **Calendar View**: Display a calendar view of previous workouts for easy tracking and visualization.
* **Data Sync**: Seamlessly sync workout data from Strava and Garmin to keep your records up-to-date.
* **Real-Time Updates**: Refresh the UI to fetch and display the latest workout data instantly.
* **Map Integration**: Display workout routes on a map using polylines if the activity includes GPS data.

## Installation

This setup is intended for developers and is not yet ready for end users.

1. Copy `example.env` to `.env` and make the necessary changes.
2. Start a PostgreSQL server:
    ```sh
    cd postgres
    docker-compose up -d
    ```
3. Set up the databases using the provided schema.
4. Bulk download Garmin data by running `garmindb_cli.py`. Refer to: [GarminDB](https://github.com/tcgoetz/GarminDB)
5. Start the UI:
    ```sh
    cd webapp
    yarn start
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

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Note that the project is still in progress, and contributions will be accepted soon.

## License

This project is licensed under the MIT License.

## Contact


For any questions or suggestions, please contact [chentingdong@gmail.com](mailto:chentingdong@gmail.com).