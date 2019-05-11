import { ApolloLink, NextLink, Observable, Operation } from "apollo-link"

export class SimulatedLatencyLink extends ApolloLink {
  constructor(private latency: number) {
    super()
  }
  request(operation: Operation, forward: NextLink) {
    return new Observable(observer => {
      const subscription = forward(operation).subscribe({
        next: data => {
          setTimeout(() => observer.next(data), this.latency)
        },
        error: error => {
          setTimeout(() => observer.error(error), this.latency)
        },
        complete: () => {
          setTimeout(() => observer.complete(), this.latency)
        },
      })
      return () => {
        subscription.unsubscribe()
      }
    })
  }
}
