import { http, createConfig } from "wagmi"
import { arbitrumSepolia } from "wagmi/chains"
import { injected, metaMask } from "wagmi/connectors"

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [injected(), metaMask()],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
