import { BadRequestException } from '@nestjs/common';
import { InquiryStatus } from '@prisma/client';

/**
 * Status transition rules
 * Defines valid state transitions for inquiry lifecycle
 */
export const STATUS_TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
  [InquiryStatus.NEW]: [InquiryStatus.CONTACTED, InquiryStatus.LOST],
  [InquiryStatus.CONTACTED]: [InquiryStatus.QUALIFIED, InquiryStatus.LOST],
  [InquiryStatus.QUALIFIED]: [InquiryStatus.QUOTING, InquiryStatus.LOST],
  [InquiryStatus.QUOTING]: [InquiryStatus.SAMPLE, InquiryStatus.LOST],
  [InquiryStatus.SAMPLE]: [InquiryStatus.TESTING, InquiryStatus.LOST],
  [InquiryStatus.TESTING]: [InquiryStatus.NEGOTIATION, InquiryStatus.LOST],
  [InquiryStatus.NEGOTIATION]: [InquiryStatus.WON, InquiryStatus.LOST],
  [InquiryStatus.WON]: [], // Terminal state
  [InquiryStatus.LOST]: [InquiryStatus.NEW], // Can be reactivated
};

export const TERMINAL_STATUSES: InquiryStatus[] = [InquiryStatus.WON];

/**
 * Status Transition Validator
 * Ensures only valid status transitions are allowed
 */
export class StatusTransitionValidator {
  /**
   * Check if a status transition is valid
   */
  canTransition(from: InquiryStatus, to: InquiryStatus): boolean {
    return STATUS_TRANSITIONS[from].includes(to);
  }

  /**
   * Validate status transition, throws if invalid
   */
  validate(currentStatus: InquiryStatus, newStatus: InquiryStatus): void {
    if (currentStatus === newStatus) {
      throw new BadRequestException({
        code: 'INVALID_STATUS_TRANSITION',
        message: 'Status is already set to the requested value',
      });
    }

    if (!this.canTransition(currentStatus, newStatus)) {
      throw new BadRequestException({
        code: 'INVALID_STATUS_TRANSITION',
        message: `Cannot transition from ${currentStatus} to ${newStatus}`,
      });
    }
  }

  /**
   * Check if status is terminal
   */
  isTerminal(status: InquiryStatus): boolean {
    return TERMINAL_STATUSES.includes(status);
  }

  /**
   * Get valid next statuses for a given status
   */
  getValidNextStatuses(currentStatus: InquiryStatus): InquiryStatus[] {
    return STATUS_TRANSITIONS[currentStatus] || [];
  }
}
