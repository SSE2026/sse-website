"""
Global Business Network Video Generator
深安锂能全球业务布局视频生成

Generates a 1920x1080 @ 30fps video with:
- World map background
- Animated node appearances
- Bezier curve connections
- Particle effects
"""

import cv2
import numpy as np
from pathlib import Path

# Configuration
WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION = 18  # seconds
TOTAL_FRAMES = FPS * DURATION

# Colors (BGR format for OpenCV)
COLORS = {
    'background': (23, 8, 2),       # #020817
    'primary': (235, 99, 37),        # #2563EB - Electric Blue
    'secondary': (212, 182, 6),     # #06B6D4 - Cyan
    'business': (129, 185, 16),     # #10B981 - Green
    'manufacturing': (246, 92, 139), # #8B5CF6 - Purple
    'accent': (11, 158, 245),        # #F59E0B - Orange
    'text': (255, 255, 255),
    'text_muted': (180, 180, 180),
    'map_stroke': (59, 130, 246),
}

# Node positions (mapped from lat/lng to pixel coordinates)
# Based on equirectangular projection
def geo_to_pixel(lat, lng, w=WIDTH, h=HEIGHT):
    """Convert geographic coordinates to pixel position"""
    x = ((lng + 180) / 360) * w
    y = ((90 - lat) / 180) * h
    return int(x), int(y)

# Core nodes
NODES = [
    {'id': 'shenzhen', 'name': '深圳', 'name_en': 'Shenzhen', 'role': '总部', 'role_en': 'HQ',
     'lat': 22.5431, 'lng': 114.0579, 'color': 'primary', 'type': 'hq'},
    {'id': 'shanghai', 'name': '上海', 'name_en': 'Shanghai', 'role': '业务中心', 'role_en': 'Business',
     'lat': 31.2304, 'lng': 121.4737, 'color': 'secondary', 'type': 'business'},
    {'id': 'guangzhou', 'name': '广州', 'name_en': 'Guangzhou', 'role': '业务中心', 'role_en': 'Business',
     'lat': 23.1291, 'lng': 113.2644, 'color': 'accent', 'type': 'business'},
    {'id': 'shaoxing', 'name': '绍兴', 'name_en': 'Shaoxing', 'role': '智造基地', 'role_en': 'Manufacturing',
     'lat': 30.002, 'lng': 120.5802, 'color': 'manufacturing', 'type': 'manufacturing'},
]

# Calculate node positions
for node in NODES:
    node['x'], node['y'] = geo_to_pixel(node['lat'], node['lng'])

# Global market regions
GLOBAL_REGIONS = [
    {'name': 'UK', 'lat': 51.5074, 'lng': -0.1278, 'priority': 'high'},
    {'name': 'Germany', 'lat': 52.52, 'lng': 13.405, 'priority': 'high'},
    {'name': 'France', 'lat': 48.8566, 'lng': 2.3522, 'priority': 'high'},
    {'name': 'USA', 'lat': 40.7128, 'lng': -74.006, 'priority': 'high'},
    {'name': 'Japan', 'lat': 35.6762, 'lng': 139.6503, 'priority': 'high'},
    {'name': 'Korea', 'lat': 37.5665, 'lng': 126.978, 'priority': 'high'},
    {'name': 'Singapore', 'lat': 1.3521, 'lng': 103.8198, 'priority': 'high'},
    {'name': 'Australia', 'lat': -33.8688, 'lng': 151.2093, 'priority': 'medium'},
    {'name': 'UAE', 'lat': 25.2048, 'lng': 55.2708, 'priority': 'medium'},
]

for region in GLOBAL_REGIONS:
    region['x'], region['y'] = geo_to_pixel(region['lat'], region['lng'])

# China regions
CHINA_REGIONS = [
    {'name': '北京', 'lat': 39.9042, 'lng': 116.4074, 'priority': 'high'},
    {'name': '杭州', 'lat': 30.2741, 'lng': 120.1551, 'priority': 'medium'},
    {'name': '香港', 'lat': 22.3193, 'lng': 114.1694, 'priority': 'high'},
    {'name': '成都', 'lat': 30.5728, 'lng': 104.0668, 'priority': 'medium'},
]

for region in CHINA_REGIONS:
    region['x'], region['y'] = geo_to_pixel(region['lat'], region['lng'])


def draw_world_map(frame, opacity=0.12):
    """Draw simplified world map outline"""
    overlay = frame.copy()

    # Simplified continent outlines (approximate paths)
    continents = {
        'north_america': np.array([
            [120, 80], [180, 60], [220, 70], [250, 90], [280, 120],
            [290, 160], [280, 200], [260, 220], [240, 230], [220, 220],
            [200, 210], [180, 200], [170, 180], [160, 160], [150, 140],
            [140, 120], [130, 100], [120, 90], [120, 80]
        ], np.int32),
        'south_america': np.array([
            [220, 260], [250, 280], [280, 320], [290, 360],
            [280, 400], [260, 420], [240, 400], [220, 380],
            [210, 350], [200, 320], [210, 290], [220, 260]
        ], np.int32),
        'europe': np.array([
            [480, 100], [520, 90], [560, 100], [580, 120],
            [570, 140], [550, 150], [520, 150], [490, 140], [480, 120]
        ], np.int32),
        'africa': np.array([
            [480, 180], [520, 180], [560, 200], [580, 240],
            [590, 280], [580, 320], [560, 360], [530, 380],
            [500, 370], [480, 340], [470, 300], [460, 260], [470, 220], [480, 190]
        ], np.int32),
        'asia': np.array([
            [580, 80], [640, 60], [720, 70], [800, 80],
            [860, 100], [900, 130], [920, 160], [900, 200],
            [860, 220], [800, 230], [740, 220], [680, 200],
            [620, 180], [580, 160], [560, 130], [570, 100], [580, 80]
        ], np.int32),
        'australia': np.array([
            [800, 340], [860, 330], [900, 350], [910, 390],
            [890, 420], [850, 430], [810, 420], [780, 400], [780, 370], [790, 350]
        ], np.int32),
    }

    # Scale to full resolution
    scale_x = WIDTH / 1000
    scale_y = HEIGHT / 480

    # Draw continents with fill
    color = tuple(int(c * opacity) for c in COLORS['map_stroke'][::-1])
    for name, points in continents.items():
        scaled_points = points.copy()
        scaled_points[:, 0] = (scaled_points[:, 0] * scale_x).astype(int)
        scaled_points[:, 1] = (scaled_points[:, 1] * scale_y).astype(int)
        cv2.fillPoly(overlay, [scaled_points], color)
        cv2.polylines(overlay, [scaled_points], True, color, 1)

    # Blend with frame
    cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)

    return frame


def draw_grid(frame):
    """Draw subtle grid lines"""
    color = (10, 20, 40)  # Very subtle

    # Latitude lines
    for lat in range(-60, 90, 30):
        y = int(((90 - lat) / 180) * HEIGHT)
        cv2.line(frame, (0, y), (WIDTH, y), color, 1)

    # Longitude lines
    for lng in range(-180, 210, 30):
        x = int(((lng + 180) / 360) * WIDTH)
        cv2.line(frame, (x, 0), (x, HEIGHT), color, 1)

    return frame


def draw_node(frame, node, progress, time):
    """Draw a single node with pulse animation"""
    x, y = node['x'], node['y']
    color = COLORS[node['color']]

    # Node size based on type
    if node['type'] == 'hq':
        core_radius = 10
        pulse_radius = 40
        glow_radius = 60
    else:
        core_radius = 7
        pulse_radius = 28
        glow_radius = 44

    # Outer glow
    glow_size = int(glow_radius * (1 + 0.1 * np.sin(time * 2)))
    glow_color = tuple(int(c * 0.3) for c in color[::-1])
    cv2.circle(frame, (x, y), glow_size, glow_color, -1)

    # Pulse ring
    pulse_phase = (time * 2 + progress) % 1
    pulse_r = int(pulse_radius * (1 + pulse_phase * 0.5))
    pulse_alpha = max(0, 1 - pulse_phase * 2)
    if pulse_alpha > 0:
        pulse_color = tuple(int(c * pulse_alpha * 0.5) for c in color[::-1])
        cv2.circle(frame, (x, y), pulse_r, pulse_color, 1)

    # Core
    cv2.circle(frame, (x, y), core_radius, color, -1)

    # Highlight
    cv2.circle(frame, (x - 2, y - 2), core_radius // 3, (200, 200, 200), -1)

    return frame


def draw_bezier_connection(frame, p0, p1, progress, color, width=2, dashed=False):
    """Draw animated Bezier curve connection between two points"""
    # Control point for natural arc
    mid_x = (p0[0] + p1[0]) // 2
    mid_y = (p0[1] + p1[1]) // 2
    offset = min(abs(p1[0] - p0[0]), abs(p1[1] - p0[1])) * 0.3
    cp = (mid_x, mid_y - int(offset)) if p0[1] < p1[1] else (mid_x, mid_y + int(offset))

    # Draw the curve
    num_points = 100
    points = []
    for i in range(num_points + 1):
        t = i / num_points
        x = int((1-t)**2 * p0[0] + 2*(1-t)*t * cp[0] + t**2 * p1[0])
        y = int((1-t)**2 * p0[1] + 2*(1-t)*t * cp[1] + t**2 * p1[1])
        points.append((x, y))

    points = np.array(points, np.int32)

    # Draw full line (dim)
    line_color = tuple(int(c * 0.3) for c in color[::-1])
    cv2.polylines(frame, [points], False, line_color, width)

    # Draw animated portion
    if progress > 0:
        animated_end = int(len(points) * min(progress, 1))
        if animated_end > 1:
            animated_points = points[:animated_end]

            # Glow effect
            glow_color = tuple(int(c * 0.5) for c in color[::-1])
            cv2.polylines(frame, [animated_points], False, glow_color, width + 2)

            # Core line
            cv2.polylines(frame, [animated_points], False, color, width)

            # Moving particle at the end
            if animated_end < len(points):
                particle_pos = points[animated_end - 1]
                cv2.circle(frame, tuple(particle_pos), 4, (255, 255, 255), -1)
                cv2.circle(frame, tuple(particle_pos), 6, color, 1)

    return frame


def draw_region_dot(frame, x, y, priority, color, time):
    """Draw a small region dot with pulse"""
    radius = 4 if priority == 'high' else 3
    pulse = 0.3 + 0.2 * np.sin(time * 3)
    dot_color = tuple(int(c * pulse) for c in color[::-1])
    cv2.circle(frame, (x, y), radius, dot_color, -1)
    return frame


def draw_particles(frame, time, count=30):
    """Draw ambient floating particles"""
    np.random.seed(42)
    for _ in range(count):
        x = int((np.sin(time * 0.5 + _) * 0.5 + 0.5) * WIDTH)
        y = int((np.cos(time * 0.3 + _ * 1.5) * 0.5 + 0.5) * HEIGHT)
        size = np.random.randint(1, 3)
        alpha = 0.2 + 0.1 * np.sin(time * 2 + _)
        color = tuple(int(c * alpha) for c in COLORS['primary'][::-1])
        cv2.circle(frame, (x, y), size, color, -1)
    return frame


def draw_legend(frame, time):
    """Draw the legend in bottom right"""
    # Background
    x, y = WIDTH - 200, HEIGHT - 150
    cv2.rectangle(frame, (x, y), (x + 180, y + 140), (10, 20, 40), -1, cv2.LINE_AA)
    cv2.rectangle(frame, (x, y), (x + 180, y + 140), (40, 60, 100), 1, cv2.LINE_AA)

    # Title
    cv2.putText(frame, "Global Network", (x + 15, y + 25),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS['text_muted'], 1)

    # Nodes
    for i, node in enumerate(NODES):
        ny = y + 45 + i * 22
        color = COLORS[node['color']]
        cv2.circle(frame, (x + 20, ny), 5, color, -1)
        cv2.putText(frame, f"{node['name']} {node['role']}", (x + 35, ny + 4),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, COLORS['text'], 1)

    return frame


def render_frame(frame_num):
    """Render a single frame based on animation time"""
    frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)

    # Fill background
    frame[:] = COLORS['background']

    # Calculate time in seconds
    time = frame_num / FPS

    # Determine animation stages
    if time < 2:
        stage = 'intro'
        stage_progress = time / 2
    elif time < 4:
        stage = 'nodes'
        stage_progress = (time - 2) / 2
    elif time < 7:
        stage = 'hq_connections'
        stage_progress = (time - 4) / 3
    elif time < 11:
        stage = 'china_reach'
        stage_progress = (time - 7) / 4
    elif time < 16:
        stage = 'global_reach'
        stage_progress = (time - 11) / 5
    else:
        stage = 'complete'
        stage_progress = 1.0

    # Draw layers in order
    draw_grid(frame)
    draw_world_map(frame, opacity=0.12 + 0.05 * min(stage_progress * 2, 1))
    draw_particles(frame, time)

    # Draw connections based on stage
    if stage in ['hq_connections', 'china_reach', 'global_reach', 'complete']:
        shenzhen = next(n for n in NODES if n['id'] == 'shenzhen')

        if stage in ['hq_connections', 'china_reach', 'global_reach', 'complete']:
            # HQ connections
            for node in NODES:
                if node['id'] != 'shenzhen':
                    conn_progress = stage_progress if stage == 'hq_connections' else 1.0
                    draw_bezier_connection(frame,
                        (shenzhen['x'], shenzhen['y']),
                        (node['x'], node['y']),
                        conn_progress, COLORS['primary'], width=2)

        if stage in ['china_reach', 'global_reach', 'complete']:
            # China connections
            for region in CHINA_REGIONS:
                for node in NODES:
                    if node['type'] in ['business', 'manufacturing']:
                        draw_bezier_connection(frame,
                            (node['x'], node['y']),
                            (region['x'], region['y']),
                            stage_progress, COLORS[node['color']], width=1, dashed=True)

        if stage in ['global_reach', 'complete']:
            # Global connections
            for region in GLOBAL_REGIONS:
                for node in NODES:
                    draw_bezier_connection(frame,
                        (node['x'], node['y']),
                        (region['x'], region['y']),
                        stage_progress, COLORS[node['color']], width=1)

    # Draw region dots
    if stage in ['china_reach', 'global_reach', 'complete']:
        for region in CHINA_REGIONS:
            draw_region_dot(frame, region['x'], region['y'], region['priority'],
                          COLORS['primary'], time)

    if stage in ['global_reach', 'complete']:
        for region in GLOBAL_REGIONS:
            draw_region_dot(frame, region['x'], region['y'], region['priority'],
                          COLORS[region['priority'] == 'high' and 'primary' or 'secondary'], time)

    # Draw nodes based on stage
    if stage in ['nodes', 'hq_connections', 'china_reach', 'global_reach', 'complete']:
        node_delays = [0, 0.3, 0.6, 0.9]  # Staggered appearance
        for i, node in enumerate(NODES):
            node_progress = max(0, min(1, (stage_progress * 4 - i * 0.5)))
            if node_progress > 0:
                draw_node(frame, node, node_progress, time)

    # Draw legend
    draw_legend(frame, time)

    # Title overlay (first few seconds)
    if time < 5:
        alpha = max(0, 1 - (time - 2) / 2) if time > 2 else 1
        if alpha > 0:
            # Title
            cv2.putText(frame, "连接全球 · 赋能未来", (WIDTH//2 - 200, HEIGHT//2 - 100),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, COLORS['text'], 2)
            cv2.putText(frame, "Connecting Global · Powering Future", (WIDTH//2 - 220, HEIGHT//2 - 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, COLORS['text_muted'], 1)

    return frame


def generate_video(output_dir):
    """Generate the complete video"""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Video writers
    mp4_path = output_dir / "global-business-network.mp4"
    webm_path = output_dir / "global-business-network.webm"

    # MP4 with H.264
    fourcc_mp4 = cv2.VideoWriter_fourcc(*'mp4v')
    writer_mp4 = cv2.VideoWriter(str(mp4_path), fourcc_mp4, FPS, (WIDTH, HEIGHT))

    # For WebM, we'll generate with VP8/VP9 compatible codec
    # Note: OpenCV's mp4v works for both, then we'll note FFmpeg conversion needed
    writer_webm = cv2.VideoWriter(str(webm_path), fourcc_mp4, FPS, (WIDTH, HEIGHT))

    print(f"Generating {TOTAL_FRAMES} frames...")

    for frame_num in range(TOTAL_FRAMES):
        frame = render_frame(frame_num)
        writer_mp4.write(frame)
        writer_webm.write(frame)

        if (frame_num + 1) % 30 == 0:
            print(f"  Frame {frame_num + 1}/{TOTAL_FRAMES} ({(frame_num+1)/TOTAL_FRAMES*100:.1f}%)")

    writer_mp4.release()
    writer_webm.release()

    # Generate poster (frame at 16 seconds - full animation)
    poster_frame = render_frame(16 * FPS)
    poster_path = output_dir / "global-business-network-poster.jpg"
    cv2.imwrite(str(poster_path), poster_frame, [cv2.IMWRITE_JPEG_QUALITY, 95])

    print(f"\nVideo generation complete!")
    print(f"  MP4: {mp4_path} ({mp4_path.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"  WebM: {webm_path} ({webm_path.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"  Poster: {poster_path}")

    return mp4_path, webm_path, poster_path


if __name__ == "__main__":
    import sys
    output = sys.argv[1] if len(sys.argv) > 1 else "public/videos"
    generate_video(output)
