import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInquiryDto } from '../dto/create-inquiry.dto';
import { InquiryType } from '@prisma/client';

/**
 * Snapshot Service
 * Generates product and requirement snapshots for inquiries
 *
 * Ensures historical inquiry data is preserved even if products are modified
 */
@Injectable()
export class SnapshotService {
  private readonly logger = new Logger(SnapshotService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate snapshot based on inquiry type
   */
  async generate(dto: CreateInquiryDto): Promise<SnapshotResult> {
    if (dto.inquiryType === InquiryType.PRODUCT) {
      return this.generateProductSnapshot(dto);
    } else if (dto.inquiryType === InquiryType.CUSTOM) {
      return this.generateRequirementSnapshot(dto);
    } else {
      // GENERAL - no snapshot needed
      return {
        productId: null,
        productName: null,
        productModel: null,
        productVariantId: null,
        variantName: null,
        variantSku: null,
        voltageSnapshot: null,
        capacitySnapshot: null,
        energySnapshot: null,
        energyDensitySnapshot: null,
        weightSnapshot: null,
        dimensionsSnapshot: null,
        chargeRateSnapshot: null,
        dischargeRateSnapshot: null,
        cycleLifeSnapshot: null,
        specificationsSnapshot: null,
      };
    }
  }

  /**
   * Generate product snapshot for PRODUCT inquiry
   */
  async generateProductSnapshot(dto: CreateInquiryDto): Promise<SnapshotResult> {
    if (!dto.productId) {
      throw new Error('productId is required for PRODUCT inquiry');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: {
        translations: {
          where: { locale: 'en' },
          take: 1,
        },
      },
    });

    if (!product) {
      throw new Error(`Product not found: ${dto.productId}`);
    }

    let variant = null;
    if (dto.productVariantId) {
      variant = await this.prisma.productVariant.findUnique({
        where: { id: dto.productVariantId },
      });

      if (variant && variant.productId !== dto.productId) {
        throw new Error('Variant does not belong to the specified product');
      }
    }

    // Get product name from translation
    const translation = product.translations[0];
    const productName = translation?.name || product.model;

    // Helper to format values with units
    const fmt = {
      voltage: (v: number | null) => v ? `${v}V` : null,
      capacity: (v: number | null) => v ? `${v}Ah` : null,
      energy: (v: number | null) => v ? `${v}Wh` : null,
      energyDensity: (v: number | null) => v ? `${v} Wh/kg` : null,
      weight: (v: number | null) => v ? `${v}kg` : null,
      dimensions: (l: number | null, w: number | null, h: number | null) =>
        (l && w && h) ? `${l}x${w}x${h}mm` : null,
      rate: (v: number | null) => v ? `${v}C` : null,
      cycleLife: (v: number | null) => v ? `${v} cycles` : null,
    };

    return {
      productId: product.id,
      productName,
      productModel: product.model,
      productVariantId: variant?.id || null,
      variantName: variant?.name || null,
      variantSku: variant?.sku || null,
      voltageSnapshot: fmt.voltage(variant?.nominalVoltage ?? product.nominalVoltage),
      capacitySnapshot: fmt.capacity(variant?.nominalCapacity ?? product.nominalCapacity),
      energySnapshot: fmt.energy(variant?.energy ?? product.energy),
      energyDensitySnapshot: fmt.energyDensity(product.energyDensity),
      weightSnapshot: fmt.weight(variant?.weight ?? product.weight),
      dimensionsSnapshot: fmt.dimensions(
        variant?.length ?? product.length,
        variant?.width ?? product.width,
        variant?.height ?? product.height,
      ),
      chargeRateSnapshot: fmt.rate(product.chargeRate),
      dischargeRateSnapshot: fmt.rate(product.dischargeRate),
      cycleLifeSnapshot: fmt.cycleLife(product.cycleLife),
      specificationsSnapshot: variant?.specifications ?? product.specifications ?? null,
    };
  }

  /**
   * Generate requirement snapshot for CUSTOM inquiry
   * Supports both individual fields and requirementSnapshot object
   */
  generateRequirementSnapshot(dto: CreateInquiryDto): SnapshotResult {
    // Prefer requirementSnapshot object if provided, otherwise use individual fields
    const req = dto.requirementSnapshot;

    return {
      productId: null,
      productName: dto.applicationName || (req?.application ? `CUSTOM: ${req.application}` : null),
      productModel: null,
      productVariantId: null,
      variantName: null,
      variantSku: null,
      // Use requirementSnapshot values if available, otherwise individual fields
      voltageSnapshot: req?.voltage != null ? `${req.voltage}V` : (dto.voltage || null),
      capacitySnapshot: req?.capacity != null ? `${req.capacity}Ah` : (dto.capacity || null),
      energySnapshot: req?.energy != null ? `${req.energy}Wh` : (dto.energy || null),
      energyDensitySnapshot: req?.energyDensity != null ? `${req.energyDensity} Wh/kg` : (dto.energyDensity || null),
      weightSnapshot: dto.weight || null,
      dimensionsSnapshot: dto.dimensions || null,
      chargeRateSnapshot: req?.chargeRate != null ? `${req.chargeRate}C` : (dto.chargeRate || null),
      dischargeRateSnapshot: req?.dischargeRate != null ? `${req.dischargeRate}C` : (dto.dischargeRate || null),
      cycleLifeSnapshot: req?.cycleLife != null ? `${req.cycleLife} cycles` : (dto.cycleLife || null),
      // Store the full requirementSnapshot as specificationsSnapshot for complete data preservation
      specificationsSnapshot: req ? {
        voltage: req.voltage,
        capacity: req.capacity,
        energy: req.energy,
        energyDensity: req.energyDensity,
        chargeRate: req.chargeRate,
        dischargeRate: req.dischargeRate,
        cycleLife: req.cycleLife,
        application: req.application,
      } : (dto.specifications || null),
    };
  }
}

/**
 * Snapshot result type
 */
export interface SnapshotResult {
  productId: string | null;
  productName: string | null;
  productModel: string | null;
  productVariantId: string | null;
  variantName: string | null;
  variantSku: string | null;
  voltageSnapshot: string | null;
  capacitySnapshot: string | null;
  energySnapshot: string | null;
  energyDensitySnapshot: string | null;
  weightSnapshot: string | null;
  dimensionsSnapshot: string | null;
  chargeRateSnapshot: string | null;
  dischargeRateSnapshot: string | null;
  cycleLifeSnapshot: string | null;
  specificationsSnapshot: any | null;
}
