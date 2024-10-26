export const template = `
my current week activities:
{currentWeekActivities}
my current week workouts:
{currentWeekWorkouts}
Based on this week's workout and activity data, provide personalized coaching advice and recommendations. Consider the following aspects:

1. Analyze the workout history:
   - Look for patterns in frequency, intensity, and types of workouts
   - Identify any gaps or imbalances in the training routine

2. Compare planned workouts with completed activities:
   - Note any discrepancies between planned and actual workouts
   - Suggest adjustments to future plans based on actual performance

3. Provide specific recommendations:
   - Suggest improvements or modifications to the workout plan
   - Offer tips for recovery, nutrition, or technique based on the data

4. Address user questions or concerns:
   - Respond to any specific queries in the input
   - Provide explanations for your recommendations

Format your response as a conversational coaching message, addressing the user directly and providing clear, actionable advice.

Input:

{input}

Output should be valid JSON.`;