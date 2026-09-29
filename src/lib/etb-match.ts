export type EtbMatchIdentity = { carrier: string; vesselName: string; voyage: string };

function normalized(value: string) {
  return value.normalize("NFKC").trim().toUpperCase().replace(/[\s\-_/]+/g, "");
}

export function sameEtbIdentity(left: EtbMatchIdentity, right: EtbMatchIdentity) {
  return normalized(left.carrier) === normalized(right.carrier)
    && normalized(left.vesselName) === normalized(right.vesselName)
    && normalized(left.voyage) === normalized(right.voyage);
}

export function uniqueEtbMatch<T extends EtbMatchIdentity>(result: EtbMatchIdentity, candidates: T[]) {
  const matches = candidates.filter(candidate => sameEtbIdentity(result, candidate));
  return matches.length === 1 ? matches[0] : undefined;
}
