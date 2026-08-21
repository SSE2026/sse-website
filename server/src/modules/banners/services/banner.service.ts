import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from '../dto';

@Injectable()
export class BannerService {
  private logger = new Logger(BannerService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==================== Public API ====================

  async findAllPublic() {
    const banners = await this.prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return banners;
  }

  async findOnePublic(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner || !banner.isActive) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  // ==================== Admin API ====================

  async findAllAdmin() {
    const banners = await this.prisma.banner.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return banners;
  }

  async findOneAdmin(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  async create(dto: CreateBannerDto) {
    // If no sortOrder provided, put at the end
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const maxOrder = await this.prisma.banner.aggregate({
        _max: { sortOrder: true },
      });
      sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
    }

    const banner = await this.prisma.banner.create({
      data: {
        title: dto.title,
        titleZh: dto.titleZh,
        subtitle: dto.subtitle,
        subtitleZh: dto.subtitleZh,
        image: dto.image || '',
        mobileImage: dto.mobileImage,
        link: dto.link,
        ctaText: dto.ctaText,
        ctaTextZh: dto.ctaTextZh,
        isActive: dto.isActive ?? true,
        sortOrder: sortOrder,
      },
    });

    this.logger.log(`Banner created: ${banner.id}`);
    return banner;
  }

  async update(id: string, dto: UpdateBannerDto) {
    const existing = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Banner not found');
    }

    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        title: dto.title,
        titleZh: dto.titleZh,
        subtitle: dto.subtitle,
        subtitleZh: dto.subtitleZh,
        image: dto.image,
        mobileImage: dto.mobileImage,
        link: dto.link,
        ctaText: dto.ctaText,
        ctaTextZh: dto.ctaTextZh,
        isActive: dto.isActive,
        sortOrder: dto.sortOrder,
      },
    });

    this.logger.log(`Banner updated: ${banner.id}`);
    return banner;
  }

  async delete(id: string) {
    const existing = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Banner not found');
    }

    await this.prisma.banner.delete({
      where: { id },
    });

    this.logger.log(`Banner deleted: ${id}`);
    return { success: true, message: 'Banner deleted successfully' };
  }

  async toggleStatus(id: string) {
    const existing = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Banner not found');
    }

    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    });

    this.logger.log(`Banner status toggled: ${banner.id}, isActive: ${banner.isActive}`);
    return banner;
  }

  async reorder(ids: string[]) {
    // Update sortOrder for each banner
    const updates = ids.map((id, index) =>
      this.prisma.banner.update({
        where: { id },
        data: { sortOrder: index },
      })
    );

    await this.prisma.$transaction(updates);

    this.logger.log(`Banners reordered`);
    return { success: true, message: 'Banners reordered successfully' };
  }
}
