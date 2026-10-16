import { redirect } from "next/navigation";
import { seriesProfiles } from "@/data/products";

// 云驰系列已按 360-P / 400-E / 460-X 拆分为三张独立页面。
// 保留旧地址,直接跳到第一个子系列,避免历史链接与收录失效。
export default function CloudchiPage() {
  redirect(`/products/${seriesProfiles["360p"].slug}`);
}
