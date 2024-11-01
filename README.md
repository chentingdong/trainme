# TrainMe

🚧 **Note: This project is currently in development and not yet ready for use.** 🚧

## Overview

TrainMe is a robust web application designed to assist athletes in effectively managing their workout schedules and tracking their fitness progress. As a self-coaching tool, TrainMe provides an intuitive interface that allows users to easily add, edit, and review their workouts. With AI-powered features, the app generates personalized weekly training plans based on past performance, enabling athletes to optimize their routines. Additionally, TrainMe seamlessly syncs with your smartwatch, delivering real-time lap notifications during runs.

## Key Features
- Workout Management: Effortlessly add, edit, and view workout sessions through an intuitive web interface.
- Workout and Strava Activity Comparison: Compare your workouts alongside your Strava activities for better insights.
- AI-Driven Training Plans: Receive customized weekly training plans based on your previous workout data.
- Smartwatch Sync: Connect with your smartwatch to receive real-time notifications for each lap during your runs.

## Local Developers
The installation is connected to Vercel.
1. Start the PostgreSQL server:
   ```sh
   docker-compose up -d
   ```
2. Set up the databases with `prisma db deploy` (check on this)
3. pull the env file from Vercel.
```zsh
vercel login
vercel link --project trainme -S naozz
vercel env pull
```
4. Start the NextJs server:
   ```sh
   pnpm dev
   ```
5. If you are using vscode, the launch.json provides a full stack development configuration.

Once the development server is running, you can access the application in your browser at `http://localhost:<process.env.NEXT_PUBLIC_PORT>`.

## Server engineer
* CI/CD with github.com actions
* vercel.com for NextJs app deployments. Preview and Production.
```zsh
# preview
vercel deploy
# production
vercel deploy --prod
```
* clerk.com for user management in company level, across products.
* lansmith.com for Langchain/Langraph monitoring
* supabase.com to hold preview and production db.

## License

© 2024 All Rights Reserved.

## Contact

For any questions or suggestions, please contact [chentingdong@gmail.com](mailto:chentingdong@gmail.com).
