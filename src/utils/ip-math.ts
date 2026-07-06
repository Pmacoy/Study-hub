export const ipToInt = (ip: string): number => {
  return ip.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;
};

export const intToIp = (int: number): string => {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
};

export const calculateBroadcast = (networkInt: number, cidr: number): number => {
  return (networkInt | (~((0xFFFFFFFF << (32 - cidr)) >>> 0))) >>> 0;
};

export const calculateHosts = (cidr: number): number => {
  return Math.max(0, Math.pow(2, 32 - cidr) - 2);
};

export interface SubnetDetails {
  networkIp: string;
  broadcastIp: string;
  firstHost: string;
  lastHost: string;
  hosts: number;
  mask: string;
}

export const getSubnetDetails = (ip: string, cidr: number): SubnetDetails => {
  const ipInt = ipToInt(ip);
  const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = calculateBroadcast(networkInt, cidr);

  return {
    networkIp: intToIp(networkInt),
    broadcastIp: intToIp(broadcastInt),
    mask: intToIp(maskInt),
    firstHost: cidr >= 31 ? "N/A" : intToIp(networkInt + 1),
    lastHost: cidr >= 31 ? "N/A" : intToIp(broadcastInt - 1),
    hosts: calculateHosts(cidr)
  };
};