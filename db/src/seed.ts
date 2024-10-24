import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

  const sportsData = [
    { id: 1, 'type': 'Run', 'sportType': 'Run', 'active': true },
    { id: 2, 'type': 'Run', 'sportType': 'TrailRun', 'active': true },
    { id: 3, 'type': 'Run', 'sportType': 'VirtualRun', 'active': false },
    { id: 4, 'type': 'Ride', 'sportType': 'Ride', 'active': true },
    { id: 5, 'type': 'Ride', 'sportType': 'GravelRide', 'active': false },
    { id: 6, 'type': 'Ride', 'sportType': 'MountainBikeRide', 'active': false },
    { id: 7, 'type': 'Ride', 'sportType': 'Velomobile', 'active': false },
    { id: 8, 'type': 'VirtualRide', 'sportType': 'VirtualRide', 'active': true },
    { id: 9, 'type': 'Swim', 'sportType': 'Swim', 'active': true },
    { id: 10, 'type': 'Yoga', 'sportType': 'Yoga', 'active': true },
    { id: 11, 'type': 'Walk', 'sportType': 'Walk', 'active': false },
    { id: 12, 'type': 'Hike', 'sportType': 'Hike', 'active': false },
    { id: 13, 'type': 'AlpineSki', 'sportType': 'AlpineSki', 'active': false },
    { id: 14, 'type': 'BackcountrySki', 'sportType': 'BackcountrySki', 'active': false },
    { id: 15, 'type': 'Canoeing', 'sportType': 'Canoeing', 'active': false },
    { id: 16, 'type': 'Crossfit', 'sportType': 'Crossfit', 'active': false },
    { id: 17, 'type': 'EBikeRide', 'sportType': 'EBikeRide', 'active': false },
    { id: 18, 'type': 'EBikeRide', 'sportType': 'EMountainBikeRide', 'active': false },
    { id: 19, 'type': 'Elliptical', 'sportType': 'Elliptical', 'active': false },
    { id: 20, 'type': 'Golf', 'sportType': 'Golf', 'active': false },
    { id: 21, 'type': 'Handcycle', 'sportType': 'Handcycle', 'active': false },
    { id: 22, 'type': 'IceSkate', 'sportType': 'IceSkate', 'active': false },
    { id: 23, 'type': 'InlineSkate', 'sportType': 'InlineSkate', 'active': false },
    { id: 24, 'type': 'Kayaking', 'sportType': 'Kayaking', 'active': false },
    { id: 25, 'type': 'Kitesurf', 'sportType': 'Kitesurf', 'active': false },
    { id: 26, 'type': 'NordicSki', 'sportType': 'NordicSki', 'active': false },
    { id: 27, 'type': 'RockClimbing', 'sportType': 'RockClimbing', 'active': false },
    { id: 28, 'type': 'RollerSki', 'sportType': 'RollerSki', 'active': false },
    { id: 29, 'type': 'Rowing', 'sportType': 'Rowing', 'active': false },
    { id: 30, 'type': 'Rowing', 'sportType': 'VirtualRow', 'active': false },
    { id: 31, 'type': 'Sail', 'sportType': 'Sail', 'active': false },
    { id: 32, 'type': 'Skateboard', 'sportType': 'Skateboard', 'active': false },
    { id: 33, 'type': 'Snowboard', 'sportType': 'Snowboard', 'active': false },
    { id: 34, 'type': 'Snowshoe', 'sportType': 'Snowshoe', 'active': false },
    { id: 35, 'type': 'Soccer', 'sportType': 'Soccer', 'active': false },
    { id: 36, 'type': 'StairStepper', 'sportType': 'StairStepper', 'active': false },
    { id: 37, 'type': 'StandUpPaddling', 'sportType': 'StandUpPaddling', 'active': false },
    { id: 38, 'type': 'Surfing', 'sportType': 'Surfing', 'active': false },
    { id: 39, 'type': 'WeightTraining', 'sportType': 'WeightTraining', 'active': true },
    { id: 40, 'type': 'Wheelchair', 'sportType': 'Wheelchair', 'active': false },
    { id: 41, 'type': 'Windsurf', 'sportType': 'Windsurf', 'active': false },
    { id: 42, 'type': 'Workout', 'sportType': 'Workout', 'active': false },
    { id: 43, 'type': 'Workout', 'sportType': 'HighIntensityIntervalTraining', 'active': false },
    { id: 44, 'type': 'Workout', 'sportType': 'Pilates', 'active': false },
  ];

async function main() {
  try {
    await prisma.sport.createMany({
      data: sportsData,
      skipDuplicates: true,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
