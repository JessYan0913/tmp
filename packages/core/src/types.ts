import { TmpElementInstance } from '@tmp/schema';

export namespace EventArgs {
  export interface Component {
    mounted: { instance: TmpElementInstance };
    updated: { beforeInstance: TmpElementInstance | null; instance: TmpElementInstance };
    unmounted: unknown;
  }
}
