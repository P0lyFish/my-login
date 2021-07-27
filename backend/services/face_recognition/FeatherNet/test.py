import models
import torch
from torchvision import transforms
import cv2
from PIL import Image
import numpy as np


net = models.FeatherNetB()
checkpoint = torch.load('checkpoints/our_pretrained_models/FeatherNetB_bs32/_47_best.pth.tar', map_location='cpu')
model_dict = {}
state_dict = net.state_dict()
for (k, v) in checkpoint['state_dict'].items():
    if k[7:] in state_dict:
        model_dict[k[7:]] = v
state_dict.update(model_dict)
net.load_state_dict(state_dict)

device = torch.device('cpu')
net.eval()
img_size = 224
ratio = 224.0 / float(img_size)
normalize = transforms.Normalize(
    mean=[0.14300402, 0.1434545, 0.14277956],
    std=[0.10050353, 0.100842826, 0.10034215]
)
transform = transforms.Compose([
    transforms.Resize(int(224 * ratio)),
    transforms.CenterCrop(img_size),
    transforms.ToTensor(), normalize
])

img = cv2.imread('phongphake_cropped.jpg')
small_img = cv2.resize(img, (224, 224))
pil_im = Image.fromarray(small_img)
img = transform(pil_im)
img = np.array(img)
img = np.expand_dims(img, 0)

input = torch.tensor(img, dtype=torch.float32, device=device)
input = input.to('cpu')
output_1 = net(input)

soft_output = torch.softmax(output_1, dim=-1)
preds = soft_output.to('cpu').detach().numpy()
print(preds)
_, predicted = torch.max(soft_output.data, 1)
predicted = predicted.to('cpu').detach().numpy()
print(predicted)
