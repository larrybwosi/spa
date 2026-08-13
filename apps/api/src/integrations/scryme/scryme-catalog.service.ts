import { Injectable } from "@nestjs/common";
import { ScrymeBaseService } from "./scryme-base.service";

@Injectable()
export class ScrymeCatalogService {
  constructor(private readonly base: ScrymeBaseService) {}

  async listCatalogProducts(): Promise<any[]> {
    return this.base.execute<any[]>(
      "/v3/{orgSlug}/catalog/products",
      () => this.base.scrymeServer.catalog.getProducts() as any,
      false,
    );
  }

  async listCatalogServices(): Promise<any[]> {
    return this.base.execute<any[]>(
      "/v3/{orgSlug}/catalog/services",
      () => this.base.scrymeServer.catalog.getServices() as any,
      false,
    );
  }
}
