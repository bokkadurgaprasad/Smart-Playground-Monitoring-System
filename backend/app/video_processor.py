import cv2
from .centriod_tracker import CentroidTracker

class VideoProcessor:
    def __init__(self):
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        self.ct = CentroidTracker()
        self.counted_ids = set()
        self.presence_count = 0

    def process_frame(self, frame):
        frame = cv2.resize(frame, (640, 480))
        frame_height, frame_width = frame.shape[:2]
        virtual_line_x = frame_width // 2

        # Detection and tracking
        rects, _ = self.hog.detectMultiScale(frame, winStride=(8, 8))
        objects = self.ct.update(rects)
        
        # Draw reference line
        cv2.line(frame, (virtual_line_x, 0), (virtual_line_x, frame_height), (0, 255, 255), 2)
        
        # Update counts and draw objects
        for objectID, centroid in objects.items():
            self._update_count(objectID, centroid, virtual_line_x)
            self._draw_object_info(frame, objectID, centroid)
        
        # Add count text
        cv2.putText(frame, f"Count: {self.presence_count}", (10, 20),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        
        return frame, self.presence_count

    def _update_count(self, objectID, centroid, virtual_line_x):
        prev_centroid = self.ct.previous_centroids.get(objectID)
        if objectID not in self.counted_ids and prev_centroid is not None:
            prev_x = prev_centroid[0]
            curr_x = centroid[0]
            
            if prev_x < virtual_line_x and curr_x >= virtual_line_x:
                self.presence_count += 1
                self.counted_ids.add(objectID)
            elif prev_x > virtual_line_x and curr_x <= virtual_line_x:
                self.presence_count = max(0, self.presence_count - 1)
                self.counted_ids.add(objectID)

    def _draw_object_info(self, frame, objectID, centroid):
        cv2.putText(frame, f"ID {objectID}", (centroid[0]-10, centroid[1]-10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        cv2.circle(frame, tuple(centroid), 4, (0, 255, 0), -1)

    def reset_counter(self):
        self.presence_count = 0
        self.counted_ids = set()