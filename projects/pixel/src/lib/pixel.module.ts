import { PixelConfiguration } from './pixel.models';
import { Inject, ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PixelService } from './pixel.service';

@NgModule({
  imports: [],
})
export class PixelSnapModule {

  private static config: PixelConfiguration | null = null;

  constructor(
    private pixel: PixelService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (!PixelSnapModule.config) {
      throw Error('ngx-pixel not configured correctly. Pass the `pixelId` property to the `forRoot()` function');
    }
    if (PixelSnapModule.config.enabled && isPlatformBrowser(platformId)) {
      this.pixel.initialize();
    }
  }

  /**
   * Initiale the Facebook Pixel Module
   *
   * Add your Pixel ID as parameter
   */
  static forRoot(config: PixelConfiguration): ModuleWithProviders<PixelSnapModule> {
    this.config = config;
    const fbPixelId = config.fbPixelId;
    const snapPixelId = config.snapPixelId;
    this.verifyPixelId(fbPixelId, snapPixelId);

    return {
      ngModule: PixelSnapModule,
      providers: [PixelService, { provide: 'config', useValue: config }]
    };
  }

  /**
   * Verifies the Pixel ID that was passed into the configuration.
   * - Checks if Pixel was initialized
   * @param pixelId Pixel ID to verify
   */
  private static verifyPixelId(fBpixelId: string, snapPixelId: string): void {
    // Have to verify first that all Pixel IDs follow the same 15 digit format
    if ((fBpixelId === null || fBpixelId === undefined || fBpixelId.length === 0)
      && (snapPixelId === null || snapPixelId === undefined || snapPixelId.length === 0)) {
      throw Error('Invalid Facebook or Snap Pixel ID. Did you pass the ID into the forRoot() function?');
    }
  }

}
