export function isProgressionValid(prevSets, currentSets) {
  const prevVolume = calculateVolume(prevSets);
  const currentVolume = calculateVolume(currentSets);

  const prevReps = sumReps(prevSets);
  const currentReps = sumReps(currentSets);

  const MIN_REP_DROP = 0.85; // permite cair até 15%

  return (
    currentVolume > prevVolume &&
    currentReps >= prevReps * MIN_REP_DROP
  );
}